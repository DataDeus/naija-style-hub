import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Store } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedStore, searchTerm]);

  const fetchData = async () => {
    try {
      const [productsRes, storesRes] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            store:stores(*)
          `)
          .eq('in_stock', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('stores')
          .select('*')
          .order('location')
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (storesRes.data) setStores(storesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedStore !== 'all') {
      filtered = filtered.filter(product => product.store_id === selectedStore);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Razor Sharp Fashion</h1>
          <p className="text-xl">Premium Fashion Across Nigeria</p>
        </div>
      </div>

      {/* Store Locations */}
      <div className="py-8 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stores.map((store) => (
              <Card key={store.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                      {store.phone && (
                        <p className="text-sm text-muted-foreground">{store.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {product.image_url && (
                  <div className="aspect-square bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-primary">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <Badge variant="outline">
                      {product.store?.location}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                    {product.size && (
                      <Badge variant="secondary" className="text-xs">
                        Size {product.size}
                      </Badge>
                    )}
                    {product.color && (
                      <Badge variant="secondary" className="text-xs">
                        {product.color}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available at {product.store?.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}