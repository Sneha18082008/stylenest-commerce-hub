# StyleNest Commerce Hub

Build a modern single-page e-commerce website for a fashion brand called "StyleNest" with two tabs in the navbar: "Store" and "Inventory".

STORE TAB: a sticky navbar with logo, search bar and cart icon; a hero section with a headline and Shop Now button; a category filter (All, Men, Women, Accessories); a responsive grid of 8 products, each with image, name, price and an Add to Cart button; a slide-in cart drawer with quantity controls, total price and a Checkout button.

INVENTORY TAB (management panel): a table of all products with image, name, category, price and stock quantity. Add buttons to add a new product (form with name, category, price, stock, image URL), edit a product and delete a product. Highlight products with stock below 5 as "Low Stock" in red, and 0 as "Out of Stock". Show summary cards on top: Total Products, Total Units in Stock, Total Inventory Value and Low Stock Items.

When a customer checks out, reduce the stock automatically and disable Add to Cart for out-of-stock items. Save data in the browser.

Use a navy and teal colour theme, rounded cards, smooth hover effects, a clean professional look and full mobile responsiveness.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2abe5dda-9aa1-409a-8c6d-7f58b62989da).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
