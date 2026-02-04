from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from products.models import Product
from .models import Cart, CartItem
import json


def get_or_create_cart(request):
    """Получение или создание корзины (по пользователю или session_key)."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    if not request.session.session_key:
        request.session.save()
    session_key = request.session.session_key
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


def cart_view(request):
    """Страница корзины."""
    cart = get_or_create_cart(request)
    return render(request, 'cart/cart.html', {'cart': cart})


@require_POST
@ensure_csrf_cookie
def add_to_cart(request):
    """Добавление товара в корзину (POST, JSON или form)."""
    if request.content_type == 'application/json':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Неверный JSON'}, status=400)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
    else:
        product_id = request.POST.get('product_id')
        quantity = int(request.POST.get('quantity', 1) or 1)
    if not product_id:
        if request.content_type == 'application/json':
            return JsonResponse({'success': False, 'message': 'Нет product_id'}, status=400)
        return redirect('products:catalog')
    product = get_object_or_404(Product, id=product_id, available=True)
    cart = get_or_create_cart(request)
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    if request.content_type == 'application/json' or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'cart_total': cart.total_items,
            'message': f'Товар «{product.name}» добавлен в корзину',
        })
    return redirect(request.META.get('HTTP_REFERER', 'cart:cart'))


@require_POST
def remove_from_cart(request, item_id):
    """Удаление позиции из корзины."""
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    return redirect('cart:cart')
