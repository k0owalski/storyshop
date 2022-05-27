public without sharing class OrderController {
    @AuraEnabled
    public static string createNewOrder(Map<String,String> contactData, Decimal price, List<Map<String, String>> products) {
        try {
            Order__c order = new Order__c(
                Contact__c = contactData.get('contact'),
                Contact_name__c = contactData.get('name'),
                Contact_phone__c = contactData.get('phone'),
                Contact_street__c = contactData.get('street'),
                Contact_postal_code__c = contactData.get('postal'),
                Contact_city__c = contactData.get('city'),
                Price__c = price
            );

            insert order;

            List<Order_Product__c> orderProducts = new List<Order_Product__c>();
            List<Book__c> booksToUpdate = new List<Book__c>();
            Id orderId = order.Id;

            for (Map<String,String> product : products) {
                Id bookId = product.get('id');
                Integer amount = Integer.valueOf(product.get('amount'));

                Order_Product__c orderProduct = new Order_Product__c(
                    Order__c = orderId,
                    Book__c = bookId,
                    Amount__c = amount
                );

                orderProducts.add(orderProduct);

                Book__c currentBook = [SELECT Availability__c, Copies_sold__c FROM Book__c WHERE Id = :bookId];
                currentBook.Availability__c -= amount;
                currentBook.Copies_sold__c += amount;
                booksToUpdate.add(currentBook);
            }

            Database.insert(orderProducts, true);
            Database.update(booksToUpdate);

            return 'SUCCESS';

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
