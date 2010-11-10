function(doc) {
  if (doc.type == 'item' && doc.user) {
      emit(doc.user, {'city': doc.city, 'item': doc.item});
  }
};
