import { Trash2, Edit2, ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TransaksiList({
  transaksi,
  loading,
  openDeleteModal,
  openEditModal,
  isDeleteOpen,
  setIsDeleteOpen,
  confirmDelete,
  formatDateString,
  formatRupiah,
  page,
  totalPages,
  goToPage
}) {
  return (
    <>
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg dark:text-slate-100 transition-colors">Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          
          {loading ? (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400">Memuat data...</p>
            </div>
          ) : transaksi.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-2">
              <p className="text-slate-500 dark:text-slate-400">Belum ada transaksi dicatat.</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block md:hidden space-y-3 mt-2">
                {transaksi.map((trx) => (
                  <div key={trx._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{trx.kategori}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDateString(trx.tanggal)}</div>
                      </div>
                      <div className={`font-bold flex items-center gap-1 ${trx.tipe === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trx.tipe === 'pemasukan' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {formatRupiah(trx.nominal)}
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-sm text-slate-600 dark:text-slate-400 truncate pr-2">{trx.catatan || '-'}</div>
                      <div className="flex gap-1 shrink-0 items-center">
                        
                        {/* LOGIKA PENGUNCIAN TRANSAKSI TABUNGAN (MOBILE) */}
                        {trx.kategori === 'Tabungan' ? (
                          <div 
                            className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-md cursor-not-allowed"
                            title="Transaksi sistem (Tabungan) tidak dapat diubah/dihapus secara manual"
                          >
                            <Lock className="w-3 h-3" /> Sistem
                          </div>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(trx)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(trx._id)} className="h-8 w-8 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto mt-2">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-slate-800 dark:hover:bg-slate-800/50">
                      <TableHead className="dark:text-slate-400">Tanggal</TableHead>
                      <TableHead className="dark:text-slate-400">Kategori & Catatan</TableHead>
                      <TableHead className="text-right dark:text-slate-400">Nominal</TableHead>
                      <TableHead className="text-center dark:text-slate-400">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaksi.map((trx) => (
                      <TableRow key={trx._id} className="dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-medium dark:text-slate-200">{formatDateString(trx.tanggal)}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{trx.kategori}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">{trx.catatan || '-'}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <div className={`flex items-center justify-end gap-1 ${trx.tipe === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {trx.tipe === 'pemasukan' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {formatRupiah(trx.nominal)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2 items-center">
                            
                            {/* LOGIKA PENGUNCIAN TRANSAKSI TABUNGAN (DESKTOP) */}
                            {trx.kategori === 'Tabungan' ? (
                              <span 
                                className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-md cursor-not-allowed"
                                title="Transaksi sistem (Tabungan) tidak dapat diubah/dihapus secara manual"
                              >
                                <Lock className="w-3 h-3" /> Sistem
                              </span>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => openEditModal(trx)} className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openDeleteModal(trx._id)} className="h-8 w-8 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4 mt-4 border-t dark:border-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Halaman <span className="font-medium">{page}</span> dari <span className="font-medium">{totalPages}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => goToPage(1)} disabled={page === 1} className="h-8 w-8 dark:border-slate-700 dark:text-slate-300">
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => goToPage(page - 1)} disabled={page === 1} className="h-8 w-8 dark:border-slate-700 dark:text-slate-300">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="icon"
                              onClick={() => goToPage(pageNum)}
                              className={`h-8 w-8 ${page === pageNum ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'dark:border-slate-700 dark:text-slate-300'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="px-1 text-slate-400">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <Button variant="outline" size="icon" onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="h-8 w-8 dark:border-slate-700 dark:text-slate-300">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => goToPage(totalPages)} disabled={page === totalPages} className="h-8 w-8 dark:border-slate-700 dark:text-slate-300">
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

        </CardContent>
      </Card>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Hapus Transaksi</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Apakah kamu yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}