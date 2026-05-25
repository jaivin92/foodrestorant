package com.foodrestorant.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.List
import androidx.compose.material.icons.rounded.Payment
import androidx.compose.material.icons.rounded.Restaurant
import androidx.compose.material.icons.rounded.TableRestaurant
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.foodrestorant.ui.theme.AppColors
import com.foodrestorant.ui.theme.AppDimensions
import com.foodrestorant.ui.theme.AppRadius
import com.foodrestorant.ui.theme.AppSpacing

data class NavItem(val label: String, val icon: ImageVector)

data class CategoryChip(val id: Int, val title: String)

val RestaurantNavItems = listOf(
    NavItem("Dashboard", Icons.Rounded.Home),
    NavItem("Tables", Icons.Rounded.TableRestaurant),
    NavItem("Orders", Icons.Rounded.List),
    NavItem("Kitchen", Icons.Rounded.Restaurant),
    NavItem("Bills", Icons.Rounded.Payment)
)

@Composable
fun PrimaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(AppDimensions.PrimaryButtonHeight),
        shape = RoundedCornerShape(AppRadius.Button),
        colors = ButtonDefaults.buttonColors(containerColor = AppColors.Primary),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
    ) { Text(text = text, style = MaterialTheme.typography.labelLarge) }
}

@Composable
fun SecondaryButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(AppDimensions.PrimaryButtonHeight),
        shape = RoundedCornerShape(AppRadius.Button),
        colors = ButtonDefaults.buttonColors(
            containerColor = AppColors.Secondary,
            contentColor = Color.White
        )
    ) { Text(text = text, style = MaterialTheme.typography.labelLarge) }
}

@Composable
fun AppCard(title: String, subtitle: String, modifier: Modifier = Modifier, trailing: @Composable (() -> Unit)? = null) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(AppRadius.Card),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            Modifier.padding(AppSpacing.Medium).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
                Text(title, style = MaterialTheme.typography.titleLarge)
                Text(subtitle, style = MaterialTheme.typography.bodyLarge, color = AppColors.TextSecondary)
            }
            trailing?.invoke()
        }
    }
}

@Composable
fun AppTextField(value: String, onValueChange: (String) -> Unit, label: String) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(AppRadius.Input)
    )
}

@Composable
fun CategorySelector(categories: List<CategoryChip>, selected: Int, onSelect: (Int) -> Unit) {
    LazyRow(contentPadding = PaddingValues(horizontal = 2.dp), horizontalArrangement = Arrangement.spacedBy(AppSpacing.Small)) {
        items(categories.size) { i ->
            val item = categories[i]
            val active = selected == item.id
            Box(
                modifier = Modifier
                    .background(if (active) AppColors.Primary else Color.White, RoundedCornerShape(999.dp))
                    .clickable { onSelect(item.id) }
                    .padding(horizontal = AppSpacing.Medium, vertical = AppSpacing.Small)
            ) {
                Text(item.title, color = if (active) Color.White else AppColors.TextPrimary)
            }
        }
    }
}

@Composable
fun RestaurantBottomNav(selected: Int, onSelect: (Int) -> Unit) {
    NavigationBar {
        RestaurantNavItems.forEachIndexed { index, item ->
            NavigationBarItem(selected = selected == index, onClick = { onSelect(index) },
                icon = { Icon(item.icon, contentDescription = item.label) }, label = { Text(item.label) })
        }
    }
}

@Composable
fun StatusChip(text: String, color: Color) {
    Box(modifier = Modifier.background(color.copy(alpha = 0.12f), RoundedCornerShape(999.dp)).padding(horizontal = AppSpacing.Medium, vertical = AppSpacing.Small)) {
        Text(text = text, color = color, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun ShimmerPlaceholder() {
    val transition = rememberInfiniteTransition(label = "shimmer")
    val alpha = transition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(animation = tween(800), repeatMode = RepeatMode.Reverse),
        label = "alpha"
    )
    Box(modifier = Modifier.fillMaxSize().background(AppColors.Background), contentAlignment = Alignment.Center) {
        Box(modifier = Modifier.size(96.dp).alpha(alpha.value).background(AppColors.Primary.copy(alpha = 0.3f), CircleShape))
    }
}
