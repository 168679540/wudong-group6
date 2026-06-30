var IMG = 'http://127.0.0.1:3000';
function fixImg(url) { if (!url) return ''; return url.startsWith('/') ? IMG + url : url; }
var api = require('../../utils/api');
Page({ data: { list: [], detail: null, comments: [], commentText: '' },
  onLoad() { this.load(); },
  onShow() { this.load(); },
  load() { api.getNotes({ pageSize: 50 }).then(r => { if (r.success) { var list = (r.data || []).map(function(x) { x.coverImage = fixImg(x.coverImage); return x; }); this.setData({ list: list }); } }); },
  like(e) { var id = e.currentTarget.dataset.id; api.likeNote(id).then(r => { if (r.success) { var l = this.data.list.map(function(n) { return n.id == id ? Object.assign({}, n, { likeCount: r.data.likeCount }) : n; }); this.setData({ list: l }); } }); },
  openDetail(e) { var id = e.currentTarget.dataset.id; api.getNoteDetail(id).then(r => { if (r.success) { r.data.note.coverImage = fixImg(r.data.note.coverImage); this.setData({ detail: r.data.note, comments: r.data.comments }); } }); },
  closeDetail() { this.setData({ detail: null, comments: [] }); },
  onCommentInput(e) { this.setData({ commentText: e.detail.value }); },
  sendComment() { if (!this.data.detail || !this.data.commentText.trim()) return; api.addComment({ travelNoteId: this.data.detail.id, content: this.data.commentText }).then(r => { if (r.success) { wx.showToast({ title: '评论成功' }); this.setData({ commentText: '' }); this.openDetail({ currentTarget: { dataset: { id: this.data.detail.id } } }); } }); },
  openPublish() { wx.showModal({ title: '发布游记', editable: true, placeholderText: '请输入游记标题', success: function(res) { if (res.confirm && res.content) { api.publishNote({ title: res.content, content: res.content, authorName: '游客' }).then(function(r) { if (r.success) { wx.showToast({ title: '发布成功，等待审核' }); this.load(); } }); } } }); }
});
