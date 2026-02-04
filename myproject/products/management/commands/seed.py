from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Создание тестовых данных (категории и товары — чай)'

    def handle(self, *args, **kwargs):
        categories_data = [
            {'name': 'Зеленый чай', 'slug': 'green', 'description': 'Неферментированный чай с нежным вкусом.'},
            {'name': 'Улун', 'slug': 'oolong', 'description': 'Полуферментированный чай.'},
            {'name': 'Пуэр', 'slug': 'puer', 'description': 'Постферментированный чай из Юньнани.'},
            {'name': 'Красный чай', 'slug': 'red', 'description': 'Ферментированный чай (в Китае называется красным).'},
        ]
        for cat_data in categories_data:
            Category.objects.get_or_create(slug=cat_data['slug'], defaults=cat_data)

        products_data = [
            {
                'category': Category.objects.get(slug='oolong'),
                'name': 'Да Хун Пао',
                'slug': 'da-hun-pao',
                'description': 'Легендарный утёсный улун с плантаций Уишаня. Глубокий вкус с минеральными нотами.',
                'price': 2800.00,
                'stock': 50,
                'weight': '50 г',
                'region': 'Фуцзянь, Китай',
            },
            {
                'category': Category.objects.get(slug='green'),
                'name': 'Лунцзин',
                'slug': 'lunczin',
                'description': 'Классический зеленый чай с плантаций Ханчжоу. Свежий, с нотами каштана.',
                'price': 1800.00,
                'stock': 100,
                'weight': '100 г',
                'region': 'Чжэцзян, Китай',
            },
            {
                'category': Category.objects.get(slug='puer'),
                'name': 'Пуэр Шу',
                'slug': 'puer-shu',
                'description': 'Выдержанный черный пуэр с землистым вкусом и бархатистой текстурой.',
                'price': 3200.00,
                'stock': 30,
                'weight': '100 г',
                'region': 'Юньнань, Китай',
            },
            {
                'category': Category.objects.get(slug='oolong'),
                'name': 'Те Гуань Инь',
                'slug': 'te-guan-in',
                'description': 'Ароматный улун с цветочными нотами. Один из самых популярных сортов.',
                'price': 2200.00,
                'stock': 80,
                'weight': '50 г',
                'region': 'Аньси, Китай',
            },
            {
                'category': Category.objects.get(slug='green'),
                'name': 'Бай Хао Инь Чжэнь',
                'slug': 'bai-hao-in-chzhen',
                'description': 'Белый чай с нежными серебряными иглами. Минимальная обработка.',
                'price': 3500.00,
                'stock': 25,
                'weight': '50 г',
                'region': 'Фуцзянь, Китай',
            },
            {
                'category': Category.objects.get(slug='red'),
                'name': 'Дянь Хун',
                'slug': 'dyan-hun',
                'description': 'Красный чай с медовыми и шоколадными нотами. Мягкий, без горечи.',
                'price': 1900.00,
                'stock': 60,
                'weight': '100 г',
                'region': 'Юньнань, Китай',
            },
        ]
        for prod_data in products_data:
            Product.objects.get_or_create(
                slug=prod_data['slug'],
                defaults=prod_data
            )
        self.stdout.write(self.style.SUCCESS('Тестовые данные созданы! Категории и чаи добавлены в каталог.'))
