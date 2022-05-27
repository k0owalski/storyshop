public with sharing class UserInformationController {
    @AuraEnabled
    public static string getUserName(){
        try {

            User user = [SELECT Name FROM User WHERE Id=:UserInfo.getUserId()];
            String userName = user.Name;

            return userName;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contact getContactFields(){
        try {
            Id contactId = [SELECT Contact.Id FROM User WHERE Id=:UserInfo.getUserId()].Contact.Id;

            return [SELECT Id, Name, Phone, OtherStreet, OtherPostalCode, OtherCity FROM Contact WHERE Id=:contactId];

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
