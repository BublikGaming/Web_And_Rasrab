from django.urls import path
from . import views

app_name = 'cart'

urlpatterns = [
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/checkout/', views.checkout, name='checkout'),
    path('cart/checkout/success/<int:order_id>/', views.checkout_success, name='checkout_success'),
    path('cart/sbp-qr/<int:order_id>/', views.sbp_qr, name='sbp_qr'),
]
