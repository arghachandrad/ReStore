using System;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
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

        [HttpGet]
        public async Task<ActionResult<Basket>> GetBasket()
        {
            // when user creates a basket on out server, we will send them a BuyerId, which we send them as Cookie
            // traversing all the Baskets in DB and find that Buyer's basket using BuyerId
            // .include is required because with that Only Basket will be send without BasketItems. Now BasketItem should Include Product
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();

            return basket;
        }

        [HttpPost]
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
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
                return StatusCode(201);

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get Basket(should have the basket for removing item)
            // remove item or reduce quantity
            // save changes
            return Ok();
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

    }
}