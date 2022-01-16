using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            // when user creates a basket on out server, we will send them a BuyerId, which we send them as Cookie
            // traversing all the Baskets in DB and find that Buyer's basket using BuyerId
            // .include is required because with that Only Basket will be send without BasketItems. Now BasketItem should Include Product
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            // Returning DTO instead of Basket(Removed serialisation object cycle error)
            return MapBasketToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get basket where to add
            // OR create new Basket If user with buyerId should have basket
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();
            // get the product with the product Id from the Products collection(not the product in basket)
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            // add Item (Using method created in entity Basket)
            basket.AddItem(product, quantity);
            // save Changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return CreatedAtRoute("GetBasket", MapBasketToDto(basket));

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get Basket(should have the basket for removing item)
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            // remove item or reduce quantity
            basket.RemoveItem(productId, quantity);
            // save changes
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
                return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
        }


        // Reusable Methods
        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket); // Entity Framework now will track this newly added entity
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                // Select => project our items into BasketItemDTO
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList() // to get List of BasketItemDTOs
            };
        }

    }
}