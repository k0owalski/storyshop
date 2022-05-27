trigger OrderStateChange on Order__c (before update, after update) {

    Map<String,Integer> statusValues = new Map<String,Integer> {
        'New' => 0,
        'In Progress' => 1,
        'Completed' => 2,
        'Cancelled' => 3
    };

    if (Trigger.isBefore) {

        for (Order__c order : Trigger.new) {
            String oldStatus = String.valueOf(Trigger.oldMap.get(order.Id).Status__c);
            String newStatus = String.valueOf(order.Status__c);

            if (statusValues.get(oldStatus) > statusValues.get(newStatus)) {
                order.addError('Nie można zmienić statusu na poprzedni!');
            }
        }

    } else {

        for (Order__c order : Trigger.new) {
            String newStatus = String.valueOf(order.Status__c);

            if (statusValues.get(newStatus) == 3) {
                Map<Id, Order_Product__c> orderItems = new Map<Id, Order_Product__c>([SELECT Book__r.Id, Amount__c FROM Order_Product__c WHERE Order__r.Id = :order.Id]);

                List<Id> bookIds = new List<Id>();
                Map<Id, Integer> quantities = new Map<Id, Integer>();

                for (String key : orderItems.keySet()) {
                    Id bookId = orderItems.get(key).Book__r.Id;

                    bookIds.add(bookId);
                    quantities.put(bookId, Integer.valueOf(orderItems.get(key).Amount__c));
                }


                List<Book__c> books = [SELECT Availability__c, Copies_sold__c FROM Book__c WHERE Id IN :bookIds];

                for (Book__c book : books) {
                    Integer amount = Integer.valueOf(quantities.get(String.valueOf(book.Id)));

                    book.Availability__c += amount;
                    book.Copies_sold__c -= amount;
                }

                Database.update(books, true);
            }
        }

    }
}
