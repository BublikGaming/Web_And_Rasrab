from django.db import models
from django.urls import reverse


class Category(models.Model):
    """Категория товара (тип чая)."""
    name = models.CharField(max_length=100, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='URL')
    description = models.TextField(verbose_name='Описание', blank=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('products:category_detail', args=[self.slug])


class Product(models.Model):
    """Товар (сорт чая)."""
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Категория'
    )
    name = models.CharField(max_length=200, verbose_name='Название')
    slug = models.SlugField(unique=True, verbose_name='URL')
    description = models.TextField(verbose_name='Описание')
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена'
    )
    image = models.ImageField(
        upload_to='products/%Y/%m/%d/',
        verbose_name='Изображение',
        blank=True,
        null=True
    )
    stock = models.PositiveIntegerField(verbose_name='Количество на складе', default=0)
    available = models.BooleanField(default=True, verbose_name='Доступен')
    weight = models.CharField(max_length=50, verbose_name='Вес/фасовка', blank=True)
    region = models.CharField(max_length=200, verbose_name='Регион', blank=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('products:product_detail', args=[self.slug])
