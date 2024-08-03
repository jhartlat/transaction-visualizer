from datetime import datetime, timedelta
import pytz
import random
import os
import json


def format_date(date):
    formatted_date = date.strftime("%m/%d/%y")
    formatted_date = date.strftime("%-m/%-d/%y") if date.strftime("%m")[0] == \
    '0' or date.strftime("%d")[0] == '0' else date.strftime("%m/%d/%y")
    return formatted_date


def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)    


def next_date(date, month_day_count):
    month_count = date.month
    month = str(date.month)
    if month_count == 2: # February
        year = date.year # 2028
        month_day_count[month] = 29 if is_leap(year) else 28
        date = date + timedelta(days=month_day_count[month])
        return format_date(date)
    else:
        date = date + timedelta(days=month_day_count[month])
        return format_date(date)


def get_current_date(timezone_str='UTC'):
    tz = pytz.timezone(timezone_str)
    return datetime.now(tz).strftime("%x")


def convert_to_date_object(date_string):
    return datetime.strptime(date_string.strip(), '%x').date()


def convert_to_date_string(date_object):
    return date_object.strftime("%x")


def update_closing_date(file_path, current_date, closing_date, month_day_count):
    if current_date > closing_date:
        # Erase the transactions
        with open(file_path, 'w') as file:
            file.write('0.00')
        next_closing_date = next_date(closing_date, month_day_count)
        return next_closing_date
    else:
        return convert_to_date_string(closing_date)
        
        
def sum_transactions(file_path):
    total = 0
    with open(file_path, 'r') as transaction_history_file:
        lines = transaction_history_file.readlines()
        for line in lines:
          try:
            total += float(line.strip())
          except ValueError:
            continue
    return f'{total:.2f}'


def get_last_transaction(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
        if lines:
            return lines[-1].strip()
        else:
            return 'None'


def get_timezone(file_path):
  with open(file_path, 'r') as file:
    content = file.read().strip()
  return content


def update_file(file_path: 'string', my_dict: 'dict', key: 'string', new_value: 'string'):
    if key in my_dict:
        my_dict[key] = new_value
        with open(file_path, 'w') as file:
            content = str(my_dict)
            file.write(content)


def get_value(key: 'string', my_dict: 'dict') -> 'string':
    if key in my_dict:
        value = my_dict[key]
        return value


def convert_to_dict(data: 'string') -> 'string':
    json_acceptable_string = data.replace("'", "\"")
    my_dict = json.loads(json_acceptable_string)
    return my_dict    


def read_file_content(file_path):
    with open(file_path, 'r') as file:
        return file.read()


def main():
    month_day_count = {
        "1": 31,
        "2": 28,  
        "3": 31,
        "4": 30,
        "5": 31,
        "6": 30,
        "7": 31,
        "8": 31,
        "9": 30,
        "10": 31,
        "11": 30,
        "12": 31
    }
    
    data_path = 'user_data.json'
    transactions_path = 'transactions.txt'
    	
    content = read_file_content(data_path)
    my_dict = convert_to_dict(content)
    
    spend_limit = get_value('Spend Limit', my_dict)
    time_zone = get_value('Time Zone', my_dict)
    today = get_current_date(time_zone)
    closing_date = get_value('Closing Date', my_dict)
    
    today_object = convert_to_date_object(today)
    closing_date_object = convert_to_date_object(closing_date)
    
    # Closing Date
    closing_date = update_closing_date(transactions_path, today_object, closing_date_object, month_day_count)
    update_file(data_path, my_dict, 'Closing Date', closing_date)
    
    # Total Spent
    total_spent = sum_transactions(transactions_path) 
    update_file(data_path, my_dict, 'Total Spent', total_spent)
    
    # Recent
    recent = get_last_transaction(transactions_path)
    update_file(data_path, my_dict, 'Recent', recent)
    
    print(my_dict)
    
main()