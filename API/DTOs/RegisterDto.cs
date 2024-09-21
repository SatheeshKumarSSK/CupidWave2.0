using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required, StringLength(8, MinimumLength = 4)]
        public string Password { get; set; } = string.Empty;
        public required string KnownAs { get; set; }
        public required string Gender { get; set; }
        public required string DateOfBirth { get; set; }
        public string? Introduction { get; set; }
        public string? Interests { get; set; }
        public string? LookingFor { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
    }
}
