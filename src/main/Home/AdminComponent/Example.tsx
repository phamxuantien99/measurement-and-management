// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import apiAxios from "../../../api/api";
// import { useDebounce } from "../../service/hooks/useDebounce";
// import { useGroups } from "../../service/hooks/useGroup";
// import { useNavigate } from "react-router-dom";

// interface User {
//   id: number;
//   user_name: string;
//   full_name: string;
//   is_active: boolean;
//   is_superuser: boolean;
//   password: string;
// }

// interface ApiResponse {
//   founds: User[];
//   search_options: {
//     ordering: string;
//     page: number;
//     page_size: number;
//     total_count: number;
//   };
// }
// function formatLabel(text: string): string {
//   const formatted = text.replace(/_/g, " ");
//   return formatted.charAt(0).toUpperCase() + formatted.slice(1);
// }

// const fetchUsers = async ({
//   pageParam = 1,
//   queryKey,
// }: {
//   pageParam?: number;
//   queryKey: [string, { search?: string }];
// }): Promise<ApiResponse> => {
//   const [_key, { search }] = queryKey;
//   const res = await apiAxios.get(
//     "https://ec2api.deltatech-backend.com/api/v1/user",
//     {
//       params: {
//         page: pageParam,
//         page_size: 20,
//         is_active: true,
//         ...(search ? { user_name__eq: search } : {}),
//       },
//     }
//   );
//   return res.data;
// };

// const AdminComponent: React.FC = () => {
//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);
//   const [editUser, setEditUser] = useState<User | null>(null);
//   const debouncedSearch = useDebounce(search, 500);
//   const [errors, setErrors] = useState<{
//     user_name?: string;
//     full_name?: string;
//     password?: string;
//   }>({});
//   const queryClient = useQueryClient();
//   const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

//   const { data: dataGeroupPermission, isLoading: isGroupsLoading } =
//     useGroups();
//   const navigate = useNavigate();
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//   } = useInfiniteQuery<ApiResponse, Error>({
//     queryKey: ["users", { search: debouncedSearch }],
//     queryFn: fetchUsers,
//     getNextPageParam: (lastPage: ApiResponse) => {
//       const { page, page_size, total_count } = lastPage.search_options;
//       const totalPages = Math.ceil(total_count / page_size);
//       return page < totalPages ? page + 1 : undefined;
//     },
//   });

//   const observerRef = useRef<HTMLDivElement | null>(null);

//   const handleObserver = useCallback(
//     (entries: IntersectionObserverEntry[]) => {
//       const [entry] = entries;
//       if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     },
//     [fetchNextPage, hasNextPage, isFetchingNextPage]
//   );

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, {
//       root: null,
//       rootMargin: "0px",
//       threshold: 1.0,
//     });
//     if (observerRef.current) observer.observe(observerRef.current);
//     return () => {
//       if (observerRef.current) observer.unobserve(observerRef.current);
//     };
//   }, [handleObserver]);

//   const handleOpen = (user?: User) => {
//     if (user) setEditUser(user);
//     else
//       setEditUser({
//         id: 0,
//         user_name: "",
//         full_name: "",
//         is_active: true,
//         is_superuser: false,
//         password: "",
//       });
//     setErrors({});
//     setOpen(true);
//   };
//   const [loadingSaveUser, setLoadingSaveUser] = useState(false);
//   const handleSave = async () => {
//     if (!editUser) return;

//     const newErrors: typeof errors = {};
//     if (!editUser.user_name.trim())
//       newErrors.user_name = "Please enter a username";
//     if (!editUser.full_name.trim())
//       newErrors.full_name = "Please enter a full name";
//     if (!editUser.password?.trim())
//       newErrors.password = "Please enter a password";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     setLoadingSaveUser(true);

//     try {
//       const queryParams = new URLSearchParams({
//         user_name: editUser.user_name,
//         full_name: editUser.full_name,
//         is_active: editUser.is_active.toString(),
//         is_superuser: editUser.is_superuser.toString(),
//         password: editUser.password,
//       });

//       const isAddMode = editUser.id === 0;
//       const url = isAddMode
//         ? `https://ec2api.deltatech-backend.com/api/v1/user?${queryParams.toString()}`
//         : `https://ec2api.deltatech-backend.com/api/v1/user/${
//             editUser.id
//           }?${queryParams.toString()}`;

//       const response = isAddMode
//         ? await apiAxios.post(url, selectedGroupIds)
//         : await apiAxios.put(url, selectedGroupIds);

//       toast.success(
//         isAddMode ? "User added successfully!" : "User updated successfully!"
//       );
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       setEditUser(null);
//       setErrors({});
//       setSelectedGroupIds([]);
//       handleClose();
//     } catch (error: any) {
//       console.error("Failed to save user:", error);

//       const isCreate = editUser.id === 0;

//       if (error.response?.status === 400) {
//         toast.error("User with this username already exists");
//       } else {
//         toast.error(
//           isCreate ? "Failed to save user!" : "Failed to update user!"
//         );
//       }
//     } finally {
//       setLoadingSaveUser(false);
//     }
//   };

//   const handleDeleteUser = async (userId: number) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this user?"
//     );
//     if (!confirmed) return;

//     try {
//       await apiAxios.put(
//         `https://ec2api.deltatech-backend.com/api/v1/user/delete/${userId}`
//       );
//       toast.success("User deleted successfully!");

//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Failed to delete user!");
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditUser(null);
//     setErrors({});
//     setSelectedGroupIds([]);
//   };

//   const allUsers = data?.pages.flatMap((page) => page.founds) || [];

//   return (
//     <div>
//       <div
//         style={{
//           position: "sticky",
//           top: "120px",
//           backgroundColor: "white",
//           zIndex: 1000,
//           paddingTop: 16,
//           width: "100%",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: 30,
//           }}
//         >
//           <h2 style={{ fontSize: 40, fontWeight: "bold" }}>
//             Management Account
//           </h2>
//           <Button
//             onClick={() => navigate("/Admin/groupPermission")}
//             variant="contained"
//             color="primary"
//           >
//             Group Permissions
//           </Button>

//           {/* <Button
//             onClick={() => navigate("/Admin/getListPermissions")}
//             variant="contained"
//             color="primary"
//           >
//             List Permissions
//           </Button> */}
//         </div>

//         <div
//           style={{ display: "flex", gap: 16, marginBottom: 24, width: "100%" }}
//         >
//           <TextField
//             label="Search by username ..."
//             variant="outlined"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{ flex: 1 }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleOpen()}
//           >
//             ➕ Add User
//           </Button>
//         </div>

//         <Box mt={2}>
//           <Typography variant="body2" color="textSecondary">
//             <Typography component="span" fontWeight="bold" color="textPrimary">
//               Total:
//             </Typography>{" "}
//             <Typography component="span" color="primary" fontWeight={500}>
//               {data?.pages.reduce((acc, page) => acc + page?.founds?.length, 0)}
//             </Typography>{" "}
//             /{" "}
//             <Typography component="span" color="textPrimary">
//               {data?.pages[0]?.search_options.total_count} users
//             </Typography>
//           </Typography>
//         </Box>
//       </div>

//       {isLoading ? (
//         <CircularProgress />
//       ) : isError ? (
//         <Typography color="error">
//           Something went wrong when fetching user data
//         </Typography>
//       ) : (
//         <TableContainer
//           component={Paper}
//           style={{ maxHeight: 900, overflowY: "auto" }}
//         >
//           <Table stickyHeader aria-label="user table">
//             <TableHead>
//               <TableRow>
//                 {[
//                   "STT",
//                   "User name",
//                   "Full name",
//                   "Group permissions",
//                   "Admin",
//                   "Active",
//                   "Actions",
//                 ].map((text, index) => (
//                   <TableCell
//                     key={index}
//                     sx={{
//                       position: "sticky",
//                       top: 0,
//                       backgroundColor: "white",
//                       zIndex: 2,
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {text}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {allUsers?.map((user, index) => (
//                 <TableRow key={index} hover>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{user?.user_name}</TableCell>
//                   <TableCell>{user?.full_name}</TableCell>
//                   <TableCell>{user?.group_ids?.join(", ")}</TableCell>
//                   <TableCell>{user?.is_superuser ? "✔️" : "❌"}</TableCell>
//                   <TableCell>{user?.is_active ? "✔️" : "❌"}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleOpen(user)}
//                       color="primary"
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteUser(user.id)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//           <div ref={observerRef} style={{ height: 40 }} />
//           {isFetchingNextPage && (
//             <div style={{ textAlign: "center", padding: 16 }}>
//               <CircularProgress size={24} />
//             </div>
//           )}
//         </TableContainer>
//       )}

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>
//           {editUser?.id === 0 ? "Add User" : "Edit User"}
//         </DialogTitle>
//         {loadingSaveUser && (
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               bottom: 0,
//               right: 0,
//               left: 0,
//               backgroundColor: "rgba(255,255,255,0.6)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               zIndex: 10,
//             }}
//           >
//             <CircularProgress />
//           </div>
//         )}
//         <DialogContent dividers>
//           <TextField
//             label="User Name"
//             value={editUser?.user_name || ""}
//             onChange={(e) => {
//               setEditUser({ ...editUser!, user_name: e.target.value });
//               if (errors.user_name)
//                 setErrors({ ...errors, user_name: undefined });
//             }}
//             fullWidth
//             margin="normal"
//             error={!!errors.user_name}
//             helperText={errors.user_name}
//           />
//           <TextField
//             label="Full Name"
//             value={editUser?.full_name || ""}
//             onChange={(e) => {
//               setEditUser({ ...editUser!, full_name: e.target.value });
//               if (errors.full_name)
//                 setErrors({ ...errors, full_name: undefined });
//             }}
//             fullWidth
//             margin="normal"
//             error={!!errors.full_name}
//             helperText={errors.full_name}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Active Status</InputLabel>
//             <Select
//               value={editUser?.is_active ? "true" : "false"}
//               onChange={(e) =>
//                 setEditUser({
//                   ...editUser!,
//                   is_active: e.target.value === "true",
//                 })
//               }
//               label="Active Status"
//             >
//               <MenuItem value="true">True</MenuItem>
//               <MenuItem value="false">False</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Super User</InputLabel>
//             <Select
//               value={editUser?.is_superuser ? "true" : "false"}
//               onChange={(e) =>
//                 setEditUser({
//                   ...editUser!,
//                   is_superuser: e.target.value === "true",
//                 })
//               }
//               label="Quyền"
//             >
//               <MenuItem value="true">True</MenuItem>
//               <MenuItem value="false">False</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             label="Password"
//             value={editUser?.password || ""}
//             onChange={(e) => {
//               setEditUser({ ...editUser!, password: e.target.value });
//               if (errors.password)
//                 setErrors({ ...errors, password: undefined });
//             }}
//             fullWidth
//             margin="normal"
//             error={!!errors.password}
//             helperText={errors.password}
//           />
//           {isGroupsLoading ? (
//             <CircularProgress size={24} style={{ marginTop: 16 }} />
//           ) : (
//             <FormControl fullWidth margin="normal">
//               <InputLabel id="group-select-label">
//                 Permission installation
//               </InputLabel>
//               <Select
//                 labelId="group-select-label"
//                 multiple
//                 value={selectedGroupIds}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setSelectedGroupIds(
//                     typeof value === "string"
//                       ? value.split(",").map(Number)
//                       : value
//                   );
//                 }}
//                 label="Chọn nhóm quyền"
//                 renderValue={(selected) => {
//                   const names = (selected as number[])
//                     .map((id) => {
//                       const group = dataGeroupPermission?.founds
//                         ?.filter((g) => g.is_active) // lọc ở đây luôn
//                         .find((g) => g.id === id);
//                       return group ? `${group.id} - ${group.name}` : null;
//                     })
//                     .filter(Boolean)
//                     .join(", ");
//                   return formatLabel(names);
//                 }}
//               >
//                 {dataGeroupPermission?.founds
//                   ?.filter((group) => group.is_active) // lọc nhóm chỉ lấy active
//                   .map((group) => (
//                     <MenuItem key={group.id} value={group.id}>
//                       <div>
//                         <strong>
//                           {group.id} - {formatLabel(group.name)}
//                         </strong>
//                         <div
//                           style={{
//                             fontSize: "12px",
//                             color: "#666",
//                             marginTop: 4,
//                           }}
//                         >
//                           {group.permissions.length > 0 ? (
//                             group.permissions.map((p, index: number) => (
//                               <div key={p.id}>
//                                 {index + 1} - {formatLabel(p.name)}
//                               </div>
//                             ))
//                           ) : (
//                             <em>No permissions</em>
//                           )}
//                         </div>
//                       </div>
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleSave} variant="contained" color="primary">
//             Save
//           </Button>
//           <Button onClick={handleClose}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminComponent;
