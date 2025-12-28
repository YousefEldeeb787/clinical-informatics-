namespace ClinicSystemBackend.Data.DTOs.Equipment
{
    public class EquipmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string SerialNumber { get; set; }
        public string Status { get; set; }
        public int? RoomId { get; set; }
        public string RoomNumber { get; set; }
        public DateTime? LastMaintenanceDate { get; set; }
        public DateTime? NextMaintenanceDate { get; set; }
        public string Notes { get; set; }
    }
}
