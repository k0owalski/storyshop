public with sharing class bookListController {
    @AuraEnabled
    public static List<SObject> getBookList (String category, String minPrice, String maxPrice, String orderBy, String recordLimit, String recordOffset, String flag) {
        String query = 'SELECT Name, Price__c, Thumbnail__c FROM Book__c';

        if (category != '') {
            query += ' WHERE Category__r.Id = \'' + category + '\'';
        }

        if (minPrice != ''  && minPrice != '0') {
            if (query.indexOf('WHERE') == -1)
                query += ' WHERE Price__c >= ' + minPrice;
            else
                query += ' AND Price__c >= ' + minPrice;
        }

        if (maxPrice != '' && maxPrice != '0') {
            if (query.indexOf('WHERE') == -1)
                query += ' WHERE Price__c <= ' + maxPrice;
            else
                query += ' AND Price__c <= ' + maxPrice;
        }

        if (flag != '') {
            if (query.indexOf('WHERE') == -1)
                query += ' WHERE ' + flag + ' = true';
            else
                query += ' AND ' + flag + ' = true';
        }

        if (orderBy != '') {
            query += ' ORDER BY ' + orderBy;
        }

        if (recordLimit != '') {
            query += ' LIMIT ' + recordLimit;
        }

        if (recordOffset != '') {
            query += ' OFFSET ' + recordOffset;
        }

        return Database.query(query);
    }

    @AuraEnabled
    public static Integer getBookCount () {
        return [SELECT COUNT() FROM Book__c];
    }
}
