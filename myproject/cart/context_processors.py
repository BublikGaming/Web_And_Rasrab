from .views import get_or_create_cart


def cart_context(request):
    """Добавляет корзину в контекст шаблонов."""
    cart = get_or_create_cart(request)
    return {'cart': cart}
