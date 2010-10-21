function(doc) {
  if (doc.type == 'item' && doc.created_at) {
      emit(doc.created_at, {'id': doc._id, 'city': doc.city, 'item': doc.item});
  }
};
