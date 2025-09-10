<?php
// Allow requests from any origin (for development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Load data
$restaurants = json_decode(file_get_contents('restaurants.json'), true);
$orders = json_decode(file_get_contents('orders.json'), true);

// Helper functions
function filterRestaurants($restaurants, $q = '', $sort = '') {
    if ($q) {
        $q = strtolower(trim($q));
        $restaurants = array_filter($restaurants, function($r) use ($q) {
            return str_contains(strtolower($r['name']), $q) ||
                   str_contains(strtolower($r['location']), $q) ||
                   str_contains(strtolower($r['cuisine']), $q) ||
                   str_contains((string)$r['id'], $q);
        });
    }
    if ($sort) {
        usort($restaurants, function($a, $b) use ($sort) {
            return strcmp($a[$sort] ?? '', $b[$sort] ?? '');
        });
    }
    return array_values($restaurants);
}


// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------

/**
 * Filter orders by restaurant, date range, order amount, and hour.
 *
 * @param array $orders List of orders
 * @param int $restaurantId Filter by restaurant ID (optional)
 * @param string $from Filter by order time (YYYY-MM-DD HH:MM:SS) (optional)
 * @param string $to Filter by order time (YYYY-MM-DD HH:MM:SS) (optional)
 * @param int $amountMin Filter by minimum order amount (optional)
 * @param int $amountMax Filter by maximum order amount (optional)
 * @param int $hourMin Filter by minimum hour of day (0-23) (optional)
 * @param int $hourMax Filter by maximum hour of day (0-23) (optional)
 * @return array Filtered list of orders
 */
function getOrdersByRestaurant($orders, $restaurantId, $from = null, $to = null, $amountMin = null, $amountMax = null, $hourMin = null, $hourMax = null) {
    $filtered = array_filter($orders, function($o) use ($restaurantId, $from, $to, $amountMin, $amountMax, $hourMin, $hourMax) {
        if ($restaurantId && $o['restaurant_id'] != $restaurantId) return false;

        $time = new DateTime($o['order_time']);
        if ($from && $time < new DateTime($from)) return false;
        if ($to && $time > new DateTime($to)) return false;

        if ($amountMin && $o['order_amount'] < $amountMin) return false;
        if ($amountMax && $o['order_amount'] > $amountMax) return false;

        $hour = (int)$time->format('H');
        if ($hourMin !== null && $hour < $hourMin) return false;
        if ($hourMax !== null && $hour > $hourMax) return false;

        return true;
    });
    return array_values($filtered);
}



// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------

/**
 * Calculate daily metrics from an array of orders.
 *
 * @param array $orders List of orders
 * @return array List of daily metrics, each containing:
 *  - date (string)
 *  - orders (int)
 *  - revenue (int)
 *  - average_order_value (float)
 *  - peak_hour (int)
 */
function dailyMetrics($orders) {
    $daily = [];
    foreach ($orders as $o) {
        $date = (new DateTime($o['order_time']))->format('Y-m-d');
        if (!isset($daily[$date])) {
            $daily[$date] = ['orders' => 0, 'revenue' => 0, 'hours' => []];
        }
        $daily[$date]['orders'] += 1;
        $daily[$date]['revenue'] += $o['order_amount'];
        $hour = (int)(new DateTime($o['order_time']))->format('H');
        if (!isset($daily[$date]['hours'][$hour])) $daily[$date]['hours'][$hour] = 0;
        $daily[$date]['hours'][$hour] += 1;
    }

    $result = [];
    foreach ($daily as $date => $data) {
        $peakHour = array_keys($data['hours'], max($data['hours']))[0];
        $result[] = [
            'date' => $date,
            'orders' => $data['orders'],
            'revenue' => $data['revenue'],
            'average_order_value' => $data['orders'] ? round($data['revenue'] / $data['orders'], 2) : 0,
            'peak_hour' => $peakHour
        ];
    }
    return $result;
}

// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------
/**
 * Get top N restaurants by revenue.
 *
 * @param array $restaurants List of restaurants
 * @param array $orders List of orders
 * @param string $from Filter by minimum date (optional)
 * @param string $to Filter by maximum date (optional)
 * @param int $limit Number of top restaurants to return (default 3)
 * @return array List of top N restaurants, each containing:
 *  - id (int)
 *  - name (string)
 *  - location (string)
 *  - cuisine (string)
 *  - revenue (int)
 *  - orders (int)
 */
function topRestaurants($restaurants, $orders, $from = null, $to = null, $limit = 3) {
    $revenueMap = [];
    foreach ($restaurants as $r) {
        $rOrders = getOrdersByRestaurant($orders, $r['id'], $from, $to);
        $totalRevenue = array_sum(array_column($rOrders, 'order_amount'));
        $revenueMap[] = array_merge($r, ['revenue' => $totalRevenue, 'orders' => count($rOrders)]);
    }
    usort($revenueMap, fn($a,$b) => $b['revenue'] <=> $a['revenue']);
    return array_slice($revenueMap, 0, $limit);
}

// Route handling
$path = $_GET['endpoint'] ?? '';
$params = $_GET;

switch ($path) {
    case 'restaurants':
        echo json_encode(filterRestaurants($restaurants, $params['q'] ?? '', $params['sort'] ?? ''));
        break;

    case 'metrics':
        if (!isset($params['restaurant_id'])) { http_response_code(400); echo json_encode(['error'=>'restaurant_id required']); exit; }
        $rId = $params['restaurant_id'];
        $filteredOrders = getOrdersByRestaurant($orders, $rId, $params['from'] ?? null, $params['to'] ?? null, $params['amount_min'] ?? null, $params['amount_max'] ?? null, $params['hour_min'] ?? null, $params['hour_max'] ?? null);
        echo json_encode(dailyMetrics($filteredOrders));
        break;

    case 'top':
        $from = $params['from'] ?? null;
        $to = $params['to'] ?? null;
        echo json_encode(topRestaurants($restaurants, $orders, $from, $to));
        break;

    default:
        http_response_code(404);
        echo json_encode(['error'=>'Invalid endpoint']);
        break;
}
