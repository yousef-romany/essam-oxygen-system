import db from "@/lib/db";

export const fetchCustomersAndSuppliersList = async () => {
  const rows = (await db).select(`
        SELECT 
        	0 as id,
        	"مجهول" AS name, 
        	'else' AS entity_type 
        
        UNION ALL

        SELECT 
            id, 
            name, 
            'customer' AS entity_type 
        FROM customers 

        UNION ALL

        SELECT 
            id, 
            name, 
            'supplier' AS entity_type 
        FROM suppliers;
        `);

  return rows;
};

export const fetchCustomersAndSuppliersListOrEmployee = async () => {
  const rows = (await db).select(`
        SELECT 
        	0 as id,
        	"أخرى" AS name, 
        	'else' AS entity_type 
        
        UNION ALL
        
        SELECT 
            id, 
            name, 
            'customer' AS entity_type 
        FROM customers 

        UNION ALL

        SELECT 
            id, 
            name, 
            'supplier' AS entity_type 
        FROM suppliers
        
        UNION ALL

        SELECT 
            id, 
            name, 
            'employee' AS entity_type 
        FROM employees;
        `);

  return rows;
};
