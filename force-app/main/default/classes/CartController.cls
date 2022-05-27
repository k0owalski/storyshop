public with sharing class CartController {
    @AuraEnabled
    public static List<Cart__c> getCartByUser(String userId) {
        try {
            return [SELECT Amount__c, Book__r.Id, Book__r.Name, Book__r.Availability__c, Book__r.Price__c, Book__r.Thumbnail__c FROM Cart__c WHERE Contact__r.Id = :userId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
