# API

1. list restaurants
```
GET api.php?endpoint=restaurants&q=Burger&sort=name
```

2. Get metrics for a restaurant
```
GET api.php?endpoint=metrics&restaurant_id=104&from=2025-06-24&to=2025-06-30
```

3. Get top 3 restaurants by revenue
```
GET api.php?endpoint=top&from=2025-06-24&to=2025-06-30
```

4. Filters: add optional params amount_min, amount_max, hour_min, hour_max
```
GET api.php?endpoint=metrics&restaurant_id=104&from=2025-06-24&to=2025-06-30&amount_min=500&hour_min=10&hour_max=20
```