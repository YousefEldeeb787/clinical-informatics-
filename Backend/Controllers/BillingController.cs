using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Billing;
using ClinicSystemBackend.Data.DTOs.Common;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BillingController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public BillingController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("invoices")]
    [Authorize(Roles = "Receptionist")]
    public async Task<ActionResult<PagedResultDto<BillingDto>>> GetInvoices(
        [FromQuery] int? patientId = null, [FromQuery] string status = null,
        [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Billings
            .Include(b => b.Patient).ThenInclude(p => p.User)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(b => b.PatientId == patientId.Value);
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(b => b.Status == status);

        var totalCount = await query.CountAsync();
        var invoices = await query.OrderByDescending(b => b.InvoiceDate)
            .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new PagedResultDto<BillingDto>
        {
            Items = _mapper.Map<List<BillingDto>>(invoices),
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("invoices/{id}")]
    public async Task<ActionResult<BillingDto>> GetInvoice(int id)
    {
        var invoice = await _context.Billings
            .Include(b => b.Patient).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (invoice == null) return NotFound();
        return Ok(_mapper.Map<BillingDto>(invoice));
    }

    [HttpPost("invoices")]
    [Authorize(Roles = "Receptionist")]
    public async Task<ActionResult<BillingDto>> CreateInvoice([FromBody] CreateBillingDto createDto)
    {
        var invoice = _mapper.Map<Billing>(createDto);
        invoice.InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-{new Random().Next(1000, 9999)}";
        invoice.InvoiceDate = DateTime.UtcNow;
        invoice.Status = "Pending";
        invoice.AmountDue = invoice.TotalAmount;

        _context.Billings.Add(invoice);
        await _context.SaveChangesAsync();

        invoice = await _context.Billings
            .Include(b => b.Patient).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(b => b.Id == invoice.Id);

        return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, _mapper.Map<BillingDto>(invoice));
    }

    [HttpPost("payments")]
    [Authorize(Roles = "Receptionist")]
    public async Task<IActionResult> RecordPayment([FromQuery] int invoiceId, [FromBody] RecordPaymentDto paymentDto)
    {
        var invoice = await _context.Billings.FindAsync(invoiceId);
        if (invoice == null) return NotFound();

        invoice.AmountPaid += paymentDto.Amount;
        invoice.AmountDue = invoice.TotalAmount - invoice.AmountPaid;
        invoice.PaymentMethod = paymentDto.PaymentMethod;

        if (invoice.AmountDue <= 0)
        {
            invoice.Status = "Paid";
            invoice.PaidDate = DateTime.UtcNow;
        }
        else
        {
            invoice.Status = "PartiallyPaid";
        }

        invoice.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Payment recorded successfully", invoice });
    }
}
