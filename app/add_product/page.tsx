"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductFormData {
  id?: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  images?: FileList | null;
}

interface VariantFormData {
  color: string;
  size: string;
  quantity: number;
}

export default function AddProductCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [activeTab, setActiveTab] = useState<"product" | "variant">("product");
  const [variants, setVariants] = useState<VariantFormData[]>([
    { color: "", size: "", quantity: 0 },
  ]);

  const handleSubmitProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const productData = {
        name: formData.get("name") as string,
        brand: formData.get("brand") as string,
        category: formData.get("category") as string,
        price: formData.get("price") as string,
        stock: formData.get("stock") as string,
        description: formData.get("description") as string,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setProduct(data.product);
      setActiveTab("variant");
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", size: "", quantity: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length > 1) {
      const updatedVariants = [...variants];
      updatedVariants.splice(index, 1);
      setVariants(updatedVariants);
    }
  };

  const handleVariantChange = (index: number, field: keyof VariantFormData, value: string | number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setVariants(updatedVariants);
  };

  const handleSubmitVariants = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!product?.id) {
        throw new Error("Product ID is required");
      }

      // Validate variants
      const hasEmptyFields = variants.some(variant => 
        !variant.color || !variant.size || variant.quantity <= 0
      );

      if (hasEmptyFields) {
        throw new Error("Please fill all required fields for all variants");
      }

      // Submit all variants

console.log("lde", variants);
const responses = await Promise.all(
  variants.map(variant => 
    fetch('/api/product_variants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...variant,
        productid: product.id
      }),
    })
  )
);
const data = await Promise.all(responses.map(response => response.json()));
console.log("l", data);
const errors = responses.filter(response => !response.ok);
if (errors.length > 0) {
  throw new Error(`Failed to save ${errors.length} variants`);
}

      router.push('/s/products');
    } catch (err) {
      console.error('Error submitting variants:', err);
      setError(err instanceof Error ? err.message : 'Failed to create variants');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => router.back();

  return (
    <div className="flex flex-col items-center p-6 gap-6">
      {/* Tab Navigation */}
      <div className="flex border-b w-full max-w-2xl">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "product" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("product")}
        >
          Product Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "variant" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"} ${!product?.id ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => product?.id && setActiveTab("variant")}
          disabled={!product?.id}
        >
          Product Variants
        </button>
      </div>

      {/* Product Form */}
      {activeTab === "product" && (
        <Card className="w-full max-w-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
                <CardDescription className="mt-1">
                  Complete all required fields to add a new product
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancel}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Premium Wireless Headphones"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    type="text"
                    placeholder="e.g. Sony, Apple, Samsung"
                    required
                  />
                </div>
{/*                 
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g. Electronics, Clothing"
                    required
                  />
                </div> */}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="Available units"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed product description..."
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              <div className="col-span-full space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <label htmlFor="images" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-md p-4 w-full text-center hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PlusCircle className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Drag & drop images or click to browse
                      </span>
                    </div>
                    <Input
                      id="images"
                      name="images"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                  </div>
                </label>
              </div>
              
              <CardFooter className="border-t py-4 flex justify-end gap-3 col-span-full">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Product"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Variant Form */}
      {activeTab === "variant" && product?.id && (
        <Card className="w-full max-w-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Add Product Variants</CardTitle>
                <CardDescription className="mt-1">
                  Add multiple variants for {product.name}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancel}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmitVariants} className="space-y-6">
              {variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Remove variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`color-${index}`}>Color *</Label>
                      <Input
                        id={`color-${index}`}
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        placeholder="e.g. Black, Red"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`size-${index}`}>Size *</Label>
                      <Input
                        id={`size-${index}`}
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        placeholder="e.g. S, M, L"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="0"
                        required
                      />
                    </div>
                    
                    {/* <div className="space-y-2">
                      <Label htmlFor={`sku-${index}`}>SKU</Label>
                      <Input
                        id={`sku-${index}`}
                        value={variant.sku || ""}
                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                        placeholder="Product SKU"
                      />
                    </div>
                     */}
                    {/* <div className="space-y-2">
                      <Label htmlFor={`price-${index}`}>Variant Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          value={variant.price || ""}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          placeholder="Override base price"
                          step="0.01"
                          min="0"
                          className="pl-8"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVariant}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Another Variant
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setActiveTab("product")}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save All Variants"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}