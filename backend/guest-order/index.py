import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Сохраняет выбор гостя: горячее, алкоголь и пожелание молодожёнам"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    if event.get('httpMethod') == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("""
            SELECT id, guest_name, hot_dish, alcohol, wish, created_at
            FROM t_p98537980_wedding_invitation_c.guest_orders
            ORDER BY created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = [
            {
                'id': r[0],
                'guest_name': r[1],
                'hot_dish': r[2],
                'alcohol': r[3] or [],
                'wish': r[4],
                'created_at': str(r[5]),
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body') or '{}')
        guest_name = body.get('guest_name', '').strip()
        hot_dish = body.get('hot_dish', '').strip()
        alcohol = body.get('alcohol', [])
        wish = body.get('wish', '').strip()

        if not guest_name:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите имя'}, ensure_ascii=False)}

        alcohol_arr = '{' + ','.join(f'"{a}"' for a in alcohol) + '}'

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO t_p98537980_wedding_invitation_c.guest_orders
               (guest_name, hot_dish, alcohol, wish)
               VALUES (%s, %s, %s, %s) RETURNING id""",
            (guest_name, hot_dish or None, alcohol_arr, wish or None)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True, 'id': new_id}, ensure_ascii=False)}

    return {'statusCode': 405, 'headers': headers, 'body': ''}
