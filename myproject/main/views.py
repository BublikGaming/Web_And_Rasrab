from django.shortcuts import render


def home(request):
    return render(request, 'main/index.html')


def about(request):
    return render(request, 'main/about.html')


def business(request):
    return render(request, 'main/business.html')


def contacts(request):
    return render(request, 'main/contacts.html')
