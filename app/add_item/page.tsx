import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function CardWithForm() {
  return (
<div
  className="relative min-h-screen"
  style={{
    backgroundImage: "url('/assets/i1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
  {/* Dark Overlay */}
  <div
    className="absolute inset-0"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} // adjust 0.4 to make it lighter/darker
  ></div>

  {/* Content Container */}
  <div className="relative z-10 flex justify-center items-center p-4 min-h-screen">
    <Card className="w-full max-w-4xl h-[90vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
        <CardDescription>Fill in all the details for your new product</CardDescription>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Your form remains unchanged */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Product Name*</Label>
                <Input id="name" placeholder="Enter product name" required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={5}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" placeholder="Enter brand name" />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-5">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price">Price*</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">EG  </span>
                  <Input
                    id="price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    required
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="stock_quantity">Stock Quantity*</Label>
                <Input id="stock_quantity" placeholder="0" type="number" required />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category*</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                <div className="mt-2 border rounded-md p-2 flex justify-center items-center h-32 bg-gray-50">
                  <span className="text-gray-400 text-sm">Image preview will appear here</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 sticky bottom-0 bg-background border-t py-4">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add Product
        </Button>
      </CardFooter>
    </Card>
  </div>
</div>

  )
}
