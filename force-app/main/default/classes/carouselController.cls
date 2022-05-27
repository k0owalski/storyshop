public with sharing class carouselController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> getBooksByFlag(String flag) {
        return Database.query('SELECT Name, Description__c, Price__c, Thumbnail__c, Category__r.Name, Author__r.Name, Availability__c FROM Book__c WHERE ' + flag + '=true');
    }
}
