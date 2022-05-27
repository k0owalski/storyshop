public with sharing class UserLoginController {
    @AuraEnabled
    public static String login(String username, String password){
        try {

            return Site.login(username, password, URL.getSalesforceBaseUrl().toExternalForm()).getUrl();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled
    // public static void register(String username, String password){
    //     try {



    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}
