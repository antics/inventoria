function(doc) {
  if (doc.stad) {
    emit(doc.stad, doc);
  }
};
