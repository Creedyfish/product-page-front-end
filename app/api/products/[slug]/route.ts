import { NextResponse } from 'next/server'
import data from '@/data.json'
 
export async function GET(req: Request, res:NextResponse) {
    try {
        const url = new URL(req.url);
        const slug = url.pathname.split('/').slice(-1)[0];
        const productName = slug.replace(/_/g, " ").toLowerCase();
        const product = data.products.find(
            (product) => product.name.toLowerCase() === productName
        );
        const response = { ...product,discount: data.discount };
      
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json(error)
    }
   
  }