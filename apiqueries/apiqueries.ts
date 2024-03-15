export async function getProduct(slug: string) {
    const res = await fetch(`/api/products/${slug}`, {
        method: "GET",
        cache: "no-cache",
      });
    
      const result = await res.json();
    return result;
  }

  export async function getCart() {
    const res = await fetch(`/api/cart`, {
        method: "GET",
        cache: "no-cache",
      });
    
      const result = await res.json();
    return result;
  }
