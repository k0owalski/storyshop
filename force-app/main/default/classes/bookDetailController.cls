public with sharing class bookDetailController {
    @AuraEnabled
    public static List<Book__c> getBookData(String bookId) {
        return [SELECT Name, Description__c, Price__c, Thumbnail__c, Category__r.Name, Author__r.Name, Availability__c FROM Book__c WHERE Id=:bookId];
    }
}
