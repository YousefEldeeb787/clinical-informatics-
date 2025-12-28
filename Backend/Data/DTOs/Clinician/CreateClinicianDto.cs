namespace ClinicSystemBackend.Data.DTOs.Clinician
{
    public class CreateClinicianDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Specialization { get; set; }
        public string LicenseNumber { get; set; }
        public string Qualifications { get; set; }
        public int YearsOfExperience { get; set; }
    }
}
