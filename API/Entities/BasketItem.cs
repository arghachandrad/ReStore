using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("BasketItems")] // table name
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; } // each BasketItem may have different quantity

        // navigation properties: means we are going to see only productId of Product NOT other properties
        public int ProductId { get; set; }
        public Product Product { get; set; }

        // adding additional navigation properties because if Basket is deleted BasketItem should be delete
        public int BasketId { get; set; }
        public Basket Basket { get; set; }

    }
}