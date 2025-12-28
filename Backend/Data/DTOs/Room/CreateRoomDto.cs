namespace ClinicSystemBackend.Data.DTOs.Room
{
    public class CreateRoomDto
    {
        public string RoomNumber { get; set; }
        public string RoomType { get; set; }
        public string Floor { get; set; }
        public int? Capacity { get; set; }
        public string Notes { get; set; }
    }
}
