var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], detail: null, comments: [], commentText: '', publishOpen: false, publishTitle: '', publishContent: '', publishLocation: '', publishCover: '' },
  onLoad() { this.load(); },
  onShow() { this.load(); },
  load() { api.getNotes({ pageSize: 50 }).then(r => { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); } }); },
  like(e) { var id = e.currentTarget.dataset.id; api.likeNote(id).then(r => { if (r.success) { var l = this.data.list.map(function(n) { return n.id == id ? Object.assign({}, n, { likeCount: r.data.likeCount }) : n; }); this.setData({ list: l }); } }); },
  openDetail(e) { var id = e.currentTarget.dataset.id; api.getNoteDetail(id).then(r => { if (r.success) { r.data.note.coverImage = fixImg(r.data.note.coverImage); this.setData({ detail: r.data.note, comments: r.data.comments }); } }); },
  closeDetail() { this.setData({ detail: null, comments: [] }); },
  onCommentInput(e) { this.setData({ commentText: e.detail.value }); },
  sendComment() { if (!this.data.detail || !this.data.commentText.trim()) return; var that = this; api.addComment({ travelNoteId: this.data.detail.id, content: this.data.commentText }).then(function(r) { if (r.success) { wx.showToast({ title: '评论成功' }); that.setData({ commentText: '' }); that.openDetail({ currentTarget: { dataset: { id: that.data.detail.id } } }); } }); },
  // 发布游记
  openPublish() { this.setData({ publishOpen: true, publishTitle: '', publishContent: '', publishLocation: '', publishCover: '' }); },
  closePublish() { this.setData({ publishOpen: false }); },
  onPublishTitle(e) { this.setData({ publishTitle: e.detail.value }); },
  onPublishContent(e) { this.setData({ publishContent: e.detail.value }); },
  onPublishLocation(e) { this.setData({ publishLocation: e.detail.value }); },
  onPublishCover(e) { this.setData({ publishCover: e.detail.value }); },
  chooseImage() { var that = this; wx.chooseMedia({ count: 1, mediaType: ['image'], sourceType: ['album', 'camera'], success(res) { var tempPath = res.tempFiles[0].tempFilePath; that.setData({ publishCover: tempPath }); wx.showToast({ title: '图片已选择(本地预览)', icon: 'none' }); } }); },
  doPublish() { var that = this; if (!this.data.publishTitle.trim() || !this.data.publishContent.trim()) { wx.showToast({ title: '请填写标题和内容', icon: 'none' }); return; } api.publishNote({ title: this.data.publishTitle.trim(), content: this.data.publishContent.trim(), location: this.data.publishLocation || '乌东苗寨', authorName: '游客', coverImage: this.data.publishCover || '' }).then(function(r) { if (r.success) { wx.showToast({ title: '发布成功，等待审核' }); that.setData({ publishOpen: false }); that.load(); } else { wx.showToast({ title: r.message || '发布失败', icon: 'none' }); } }); }
});
