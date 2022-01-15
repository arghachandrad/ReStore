using System.Collections.Generic;
using System.Linq;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>(); // initializing with new Empty List of BasketItem(One to Many relationship)

        public void AddItem(Product product, int quantity)
        {
            // if not in list, then first add and set quantity
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem { Product = product, Quantity = quantity });
            }

            // if product or item already present in Basket, then increase quantity
            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id); // finding the item to be added
            if (existingItem != null) existingItem.Quantity += quantity; // changing the quantity

        }

        public void RemoveItem(int productId, int quantity)
        {
            // getting the item to be removed
            var item = Items.FirstOrDefault(item => item.ProductId == productId);

            // if no item found
            if (item == null) return;

            item.Quantity -= quantity;

            // after reducing if quantity = 0, then remove it
            if (item.Quantity == 0) Items.Remove(item);
        }
    }
}