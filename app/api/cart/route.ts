import { NextResponse } from "next/server";
import data from '@/data.json'

export async function GET(req: Request, res:NextResponse) {
    try {
        const cartData = data.cart
      
        return NextResponse.json(cartData)
    } catch (error) {
        return NextResponse.json(error)
    }
   
  }

export async function POST(req: Request, res:NextResponse) {
    try {
      const itemData= req.body
      console.log(itemData)
        return NextResponse.json(itemData)
    } catch (error) {
        return NextResponse.json(error)
    }
   
  }