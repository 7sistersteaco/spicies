select 
    column_name, 
    data_type, 
    column_default 
from 
    information_schema.columns 
where 
    table_name = 'customers' or table_name = 'orders'
order by 
    table_name, ordinal_position;
