using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Billing;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class BillingService : IBillingService
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public BillingService(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BillingDto> GetByIdAsync(int id)
        {
            var billing = await _context.Billings
                .Include(b => b.Patient)
                .Include(b => b.Insurance)
                .FirstOrDefaultAsync(b => b.Id == id);

            return _mapper.Map<BillingDto>(billing);
        }

        public async Task<IEnumerable<BillingDto>> GetByPatientIdAsync(int patientId)
        {
            var billings = await _context.Billings
                .Include(b => b.Patient)
                .Include(b => b.Insurance)
                .Where(b => b.PatientId == patientId)
                .OrderByDescending(b => b.InvoiceDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<BillingDto>>(billings);
        }

        public async Task<BillingDto> CreateAsync(CreateBillingDto dto)
        {
            var billing = _mapper.Map<Billing>(dto);
            billing.InvoiceNumber = GenerateInvoiceNumber();
            billing.InvoiceDate = DateTime.UtcNow;
            
            // Calculate totals
            var lineItemsTotal = dto.LineItems.Sum(x => x.Quantity * x.UnitPrice);
            billing.SubTotal = lineItemsTotal;
            billing.TotalAmount = lineItemsTotal + dto.Tax - dto.Discount;
            billing.AmountDue = billing.TotalAmount;
            billing.Status = "Pending";
            
            billing.CreatedAt = DateTime.UtcNow;
            billing.UpdatedAt = DateTime.UtcNow;

            _context.Billings.Add(billing);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(billing.Id);
        }

        public async Task<BillingDto> RecordPaymentAsync(int id, RecordPaymentDto dto)
        {
            var billing = await _context.Billings.FindAsync(id);
            if (billing == null) return null;

            billing.AmountPaid += dto.Amount;
            billing.AmountDue = billing.TotalAmount - billing.AmountPaid;
            billing.PaymentMethod = dto.PaymentMethod;
            billing.PaidDate = dto.PaymentDate;
            billing.Status = billing.AmountPaid >= billing.TotalAmount ? "Paid" : "PartiallyPaid";
            billing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var billing = await _context.Billings.FindAsync(id);
            if (billing == null) return false;

            billing.IsDeleted = true;
            billing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetOutstandingBalanceAsync(int patientId)
        {
            var outstandingBillings = await _context.Billings
                .Where(b => b.PatientId == patientId && b.Status != "Paid")
                .ToListAsync();

            return outstandingBillings.Sum(b => b.AmountDue);
        }

        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        }
    }
}
