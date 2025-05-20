namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'size' => 'required|string|max:10',
            'color' => 'required|string|max:50',
            'quantity' => 'required|integer|min:1',
        ]);

        CartItem::create($validated);

        return response()->json(['message' => 'Item added to cart'], 201);
    }
}
