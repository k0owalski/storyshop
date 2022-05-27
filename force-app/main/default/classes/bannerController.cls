public with sharing class bannerController {
    @AuraEnabled
    public static List<Banner_slide__c> getBannerSlides() {
        return [SELECT Name, Subtitle__c, File_Name__c, Href__c FROM Banner_slide__c];
    }
}
