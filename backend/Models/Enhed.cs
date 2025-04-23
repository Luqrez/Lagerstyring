using System;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;


namespace Backend.Models
{
    [Table("enhed")]
    public class Enhed : BaseModel
    {
        [PrimaryKey("id")]
        public long Id { get; set; }
        [Column("value")]
        public string Value { get; set; }
    }
};

