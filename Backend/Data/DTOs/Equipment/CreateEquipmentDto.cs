namespace ClinicSystemBackend.Data.DTOs.Equipment
{
    public class CreateEquipmentDto
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public string SerialNumber { get; set; }
        public int? RoomId { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public string Notes { get; set; }
    }
}
