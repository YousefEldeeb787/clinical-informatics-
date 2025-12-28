namespace ClinicSystemBackend.Data.DTOs.Room
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public string Status { get; set; }
        public string Floor { get; set; }
        public int? Capacity { get; set; }
        public string Notes { get; set; }
    }
}
