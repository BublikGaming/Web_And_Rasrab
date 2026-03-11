from django import forms


class CheckoutForm(forms.Form):
    full_name = forms.CharField(label="ФИО", max_length=200)
    email = forms.EmailField(label="Email")
    phone = forms.CharField(label="Телефон", max_length=50)
    address = forms.CharField(label="Адрес доставки", max_length=255)

