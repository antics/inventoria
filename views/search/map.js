function(doc) {
  if (doc.type == 'item' && doc.created_at) {
      emit(doc._id, {'city': doc.city, 'item': doc.item, 'image': doc.image});
  }
};
