public with sharing class NavigationController {
    @AuraEnabled(cacheable=true)
    public static List<Navigation_item__c> getNavigationItems(){
        return [SELECT Name, URL__c FROM Navigation_item__c ORDER BY Priority__c DESC, Name];
    }
}
