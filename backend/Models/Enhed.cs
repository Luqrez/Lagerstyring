using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("enhed")]
    public class Enhed : BaseModel
    {
        [PrimaryKey("id")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public long? Id { get; set; }
        [Column("value")]
        public string Value { get; set; } = string.Empty;
    }
};

