ALTER TABLE agro_product ADD COLUMN origin VARCHAR(255) NULL AFTER description;
UPDATE agro_product SET origin='贵州黔东南乌东村高山茶园' WHERE id=1;
UPDATE agro_product SET origin='乌东苗寨传统烟熏工坊' WHERE id=2;
UPDATE agro_product SET origin='乌东苗家自酿作坊' WHERE id=3;
UPDATE agro_product SET origin='乌东苗家传统发酵工坊' WHERE id=4;
